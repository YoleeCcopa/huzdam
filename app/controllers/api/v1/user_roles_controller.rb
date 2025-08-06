class Api::V1::UserRolesController < Api::V1::BaseController
  before_action :authenticate_user!
  load_and_authorize_resource class: "UserRole", only: [ :create, :update, :destroy ]

  # POST /api/v1/user_roles
  def create
    # Ensure the user is authorized to assign the role
    return render json: { error: "Not authorized" }, status: :forbidden unless owner?(@user_role.object)

    if @user_role.save
      # Handle hidden state if it's passed in params
      update_denied_access(@user_role.object, params.dig(:user_role, :hidden)) if params.dig(:user_role, :hidden).present?
      render json: @user_role, status: :created
    else
      render json: { errors: @user_role.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/user_roles/:id
  def update
    # Ensure the user is authorized to update the role
    return render json: { error: "Not authorized" }, status: :forbidden unless owner?(@user_role.object)

    # Update the user role but exclude the hidden flag from being updated directly
    if @user_role.update(user_role_update_params.except(:hidden))
      # Handle hidden state if passed
      update_denied_access(@user_role.object, params.dig(:user_role, :hidden)) if params.dig(:user_role, :hidden).present?
      render json: @user_role
    else
      render json: { errors: @user_role.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/user_roles/:id
  def destroy
    # Ensure the user is authorized to delete the role
    return render json: { error: "Not authorized" }, status: :forbidden unless owner?(@user_role.object)

    # Clean up any denied access for this user and object
    DeniedAccess.where(user: @user_role.user, object: @user_role.object).destroy_all

    @user_role.destroy
    render json: { message: "Permission revoked" }, status: :ok
  end

  private

  # Permit only the relevant fields
  def user_role_update_params
    params.require(:user_role).permit(:role_id, :hidden)
  end

  # Check if the user is the owner of the object
  def owner?(object)
    object.user_id == current_user.id
  end

  # Update or remove the DeniedAccess based on the hidden flag
  def update_denied_access(object, hidden)
    return unless hidden.in?([ true, false ]) # Ensure we have a valid value

    if hidden
      # Ensure only one denied access record exists for the combination
      DeniedAccess.find_or_create_by(user: @user_role.user, object: object)
    else
      # Remove the denied access if the hidden flag is false
      DeniedAccess.where(user: @user_role.user, object: object).destroy_all
    end
  end
end
