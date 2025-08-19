class ApplicationMailerPreview < ActionMailer::Preview
  def confirmation_instructions
    user = User.new(
      email: "preview@example.com",
      user_name: "preview_user",
      display_name: "Preview User"
    )

    token = Devise.token_generator.generate(User, :confirmation_token).first

    ApplicationMailer.confirmation_instructions(user, token)
  end

  def reset_password_instructions
    user = User.new(email: "reset@example.com", user_name: "reset_user")
    token = Devise.token_generator.generate(User, :reset_password_token).first

    ApplicationMailer.reset_password_instructions(user, token)
  end
end
