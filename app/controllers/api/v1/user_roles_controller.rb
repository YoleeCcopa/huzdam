class Api::V1::UserRolesController < Api::V1::BaseController
  load_and_authorize_resource class: "UserRole", only: [:create, :update, :destroy]

  # POST /api/v1/user_roles
  def create
    return render_forbidden unless owner?(@user_role.object)

    if @user_role.save
      update_denied_access(@user_role.object, params.dig(:user_role, :hidden)) if params.dig(:user_role, :hidden).present?
      render_success(data: @user_role, message: "User role assigned", status: :created)
    else
      render_error(message: "Failed to assign role", errors: @user_role.errors.full_messages, fields: @user_role.errors.to_hash)
    end
  end

  # PATCH /api/v1/user_roles/:id
  def update
    return render_forbidden unless owner?(@user_role.object)

    if @user_role.update(user_role_update_params.except(:hidden))
      update_denied_access(@user_role.object, params.dig(:user_role, :hidden)) if params.dig(:user_role, :hidden).present?
      render_success(data: @user_role, message: "User role updated")
    else
      render_error(message: "Failed to update role", errors: @user_role.errors.full_messages, fields: @user_role.errors.to_hash)
    end
  end

  # DELETE /api/v1/user_roles/:id
  def destroy
    return render_forbidden unless owner?(@user_role.object)

    DeniedAccess.where(user: @user_role.user, object: @user_role.object).destroy_all
    @user_role.destroy
    render_success(message: "Permission revoked", data: nil)
  end

  private

  def user_role_update_params
    params.require(:user_role).permit(:role_id, :hidden)
  end

  def owner?(object)
    object.user_id == current_user.id
  end

  def update_denied_access(object, hidden)
    return unless [true, false].include?(hidden)

    if hidden
      DeniedAccess.find_or_create_by(user: @user_role.user, object: object)
    else
      DeniedAccess.where(user: @user_role.user, object: object).destroy_all
    end
  end
end
