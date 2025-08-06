class Api::V1::UserRolesController < Api::V1::BaseController
  before_action :authenticate_user!
  load_and_authorize_resource class: 'UserRole', only: [:update, :destroy]

  # POST /api/v1/user_roles
  def create
    @user_role = UserRole.new(user_role_params)

    # Only the owner of the object can assign roles
    unless owner?(@user_role.object)
      return render json: { error: "Not authorized" }, status: :forbidden
    end

    if @user_role.save
      render json: @user_role, status: :created
    else
      render json: { errors: @user_role.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/user_roles/:id
  def update
    # Only the owner of the object can update roles
    unless owner?(@user_role.object)
      return render json: { error: "Not authorized" }, status: :forbidden
    end

    if @user_role.update(user_role_update_params)
      render json: @user_role
    else
      render json: { errors: @user_role.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/user_roles/:id
  def destroy
    # Only the owner of the object can delete roles
    unless owner?(@user_role.object)
      return render json: { error: "Not authorized" }, status: :forbidden
    end

    @user_role.destroy
    render json: { message: "Permission revoked" }, status: :ok
  end

  private

  def user_role_params
    params.require(:user_role).permit(:user_id, :role_id, :object_type, :object_id)
  end

  def user_role_update_params
    params.require(:user_role).permit(:role_id, :hidden)
  end

  def owner?(object)
    object.user_id == current_user.id
  end
end