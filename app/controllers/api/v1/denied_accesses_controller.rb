class Api::V1::DeniedAccessesController < Api::V1::BaseController
  before_action :authenticate_user!

  # PATCH /api/v1/denied_accesses/toggle_visibility
  def toggle_visibility
    # Ensure the owner is attempting to toggle visibility
    object = find_object(params[:object_type], params[:object_id])
    return render json: { error: "Object not found" }, status: :not_found unless object

    if object.user_id != current_user.id
      return render json: { error: "Not authorized to manage visibility for this object" }, status: :forbidden
    end

    # Check if DeniedAccess exists
    denied_access = DeniedAccess.find_by(user_id: params[:user_id], object: object)

    if denied_access
      # Toggle the visibility
      denied_access.update(hidden: !denied_access.hidden)
      render json: { message: "Visibility toggled", hidden: denied_access.hidden }, status: :ok
    else
      # Create a new DeniedAccess with hidden flag set to true
      denied_access = DeniedAccess.create(user_id: params[:user_id], object: object, hidden: true)
      if denied_access.save
        render json: { message: "Object visibility hidden", hidden: true }, status: :created
      else
        render json: { errors: denied_access.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end

  private

  def find_object(object_type, object_id)
    case object_type
    when "Shelf"
      Shelf.find_by(id: object_id)
    when "Container"
      Container.find_by(id: object_id)
    when "Item"
      Item.find_by(id: object_id)
    else
      nil
    end
  end
end
