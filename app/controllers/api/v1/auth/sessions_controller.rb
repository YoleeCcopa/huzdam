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

        return render_success(
          data: user.as_json(only: %i[id email user_name display_name image]),
          message: "Login successful"
        )
      else
        return render_error(message: "Invalid password", code: :invalid_password, status: :unauthorized)
      end
    else
      user.generate_magic_login_token!
      ApplicationMailer.send_token(user).deliver_later

      return render_success(
        message: "Magic login link sent to your email",
        data: user.as_json(only: %i[id email user_name])
      )
    end
  end
end
