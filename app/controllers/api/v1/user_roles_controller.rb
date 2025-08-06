class Api::V1::UserRolesController < Api::V1::BaseController
  before_action :authenticate_user!
  load_and_authorize_resource class: "UserRole", only: [:create, :update, :destroy]

  # POST /api/v1/user_roles
  def create
    return render json: { error: "Not authorized" }, status: :forbidden unless owner?(@user_role.object)

    if @user_role.save
      # Handle hidden state if passed
      update_denied_access(@user_role.object, params[:user_role][:hidden]) if params[:user_role].key?(:hidden)
      render json: @user_role, status: :created
    else
      render json: { errors: @user_role.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/user_roles/:id
  def update
    return render json: { error: "Not authorized" }, status: :forbidden unless owner?(@user_role.object)

    if @user_role.update(user_role_update_params.except(:hidden))
      # Handle hidden state update
      update_denied_access(@user_role.object, user_role_update_params[:hidden])
      render json: @user_role
    else
      render json: { errors: @user_role.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/user_roles/:id
  def destroy
    return render json: { error: "Not authorized" }, status: :forbidden unless owner?(@user_role.object)

    # Remove denied access if it exists
    DeniedAccess.where(user: @user_role.user, object: @user_role.object).destroy_all
    @user_role.destroy
    render json: { message: "Permission revoked" }, status: :ok
  end

  private

  def user_role_update_params
    params.require(:user_role).permit(:role_id, :hidden)
  end

  def owner?(object)
    object.user_id == current_user.id
  end

  def update_denied_access(object, hidden)
    return unless hidden.in?([true, false])

    if hidden
      DeniedAccess.find_or_create_by(user: @user_role.user, object: object)
    else
      DeniedAccess.where(user: @user_role.user, object: object).destroy_all
    end
  end
end
