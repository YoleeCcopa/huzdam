class ApplicationMailer < Devise::Mailer
  include Rails.application.routes.url_helpers
  
  default from: "no-reply@yourdomain.com"
  layout "mailer_custom"

  def confirmation_instructions(record, token, opts = {})
    super
  end

  def reset_password_instructions(record, token, opts = {})
    super
  end

  def unlock_instructions(record, token, opts = {})
    super
  end

  def send_token(user)
    @user = user
    @magic_link = "#{ENV['FRONTEND_URL']}/magic-login?token=#{user.magic_login_token}&identifier=#{user.user_name || user.email}"
    mail(to: @user.email, subject: 'Your Magic Login Link')
  end
end
