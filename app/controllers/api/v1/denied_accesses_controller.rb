class Api::V1::DeniedAccessesController < Api::V1::BaseController
  # PATCH /api/v1/denied_accesses/toggle_visibility
  def toggle_visibility
    object = find_object(params[:object_type], params[:object_id])
    return render_not_found("Object") unless object

    return render_forbidden("Not authorized to manage visibility") unless object.user_id == current_user.id

    denied_access = DeniedAccess.find_by(user_id: params[:user_id], object: object)

    if denied_access
      denied_access.update(hidden: !denied_access.hidden)
      render_success(data: { hidden: denied_access.hidden }, message: "Visibility toggled")
    else
      denied_access = DeniedAccess.new(user_id: params[:user_id], object: object, hidden: true)

      if denied_access.save
        render_success(data: { hidden: true }, message: "Object visibility hidden", status: :created)
      else
        render_error(message: "Failed to hide object", errors: denied_access.errors.full_messages, fields: denied_access.errors.to_hash)
      end
    end
  end

  private

  def find_object(object_type, object_id)
    case object_type
    when "Shelf" then Shelf.find_by(id: object_id)
    when "Container" then Container.find_by(id: object_id)
    when "Item" then Item.find_by(id: object_id)
    else nil
    end
  end
end
