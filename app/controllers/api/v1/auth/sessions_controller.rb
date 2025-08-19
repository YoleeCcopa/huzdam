class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController
  include ApiResponse

  def create
    identifier = params[:identifier]
    password = params[:password]

    user = User.find_by(email: identifier) || User.find_by(user_name: identifier)

    unless user
      return render_not_found("User")
    end

    if password.present?
      if user.valid_password?(password)
        sign_in(:user, user)

        # Generate and set token headers
        token_data = user.create_new_auth_token
        response.headers.merge!(token_data)

        render_success(
          data: user.as_json(only: %i[id email user_name display_name image]),
          message: "Login successful"
        )
      else
        render_error(message: "Invalid password", code: :invalid_password, status: :unauthorized)
      end
    else
      user.generate_magic_login_token!
      ApplicationMailer.send_token(user).deliver_later

      render_success(
        message: "Magic login link sent to your email",
        data: user.as_json(only: %i[id email user_name])
      )
    end
  end

  # GET /api/v1/magic_login?token=abc123
  def magic_login
    user = User.find_by(magic_login_token: params[:token])

    if user&.magic_login_token_valid?
      sign_in(:user, user)

      token_data = user.create_new_auth_token
      response.headers.merge!(token_data)

      render_success(
        message: "Logged in successfully with magic link",
        data: user.slice(:id, :email, :user_name, :display_name, :image)
      )
    else
      render_error(message: "Invalid or expired token", status: :unauthorized)
    end
  end
end
