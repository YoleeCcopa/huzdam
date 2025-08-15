class ApplicationMailer < Devise::Mailer
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
end
