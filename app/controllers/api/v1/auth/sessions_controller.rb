class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController
  include ApiResponse

  # Override the default create method for sign-in (log in)
  def create
    # Check if the email or username is provided in params
    user_param = params[:email] || params[:user_name]

    # Attempt to find the user based on email or username
    user = User.find_by("email = ? OR user_name = ?", user_param, user_param)

    if user
      # Perform the login
      if user.valid_password?(params[:password])
        # Sign in the user
        sign_in(user)
        render json: {
          status: "success",
          data: user.slice(
            :id, :email, :uid, :provider, :allow_password_change,
            :user_name, :display_name, :image, :role_id
          )
        }
      else
        render json: {
          status: "error",
          message: "Invalid password"
        }, status: :unauthorized
      end
    else
      render json: {
        status: "error",
        message: "User not found"
      }, status: :unauthorized
    end
  end

  # Optionally override other methods, e.g., destroy (log out)
  def destroy
    super do
      render_success(message: "Signed out successfully")
    end
  end
end
