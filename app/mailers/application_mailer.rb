class ApplicationMailer < Devise::Mailer
  helper :application
  default template_path: "mailer"

  def confirmation_instructions(record, token, opts = {})
    opts[:subject] = "Welcome! Confirm Your Email"
    super
  end
end
