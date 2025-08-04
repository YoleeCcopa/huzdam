class ApplicationMailer < Devise::Mailer
  helper :application # gives access to `application_helper`
  default template_path: 'mailer' # make sure this folder exists

  def confirmation_instructions(record, token, opts = {})
    opts[:subject] = "Welcome! Confirm Your Email"
    super
  end
end