class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  include ApiResponse

  def create
    build_resource

    if resource.save
      # yield resource if block_given?

      render_success(
        data: resource.as_json(only: [ :id, :email, :user_name, :display_name ]),
        message: "User created successfully",
        status: :created
      )
    else
      render_error(
        message: "Failed to create user",
        errors: resource.errors.full_messages,
        fields: resource.errors.to_hash(true)
      )
    end
  end

  private

  def sign_up_params
    params.require(:registration).permit(:email, :password, :password_confirmation, :user_name, :display_name)
  end

  def build_resource(hash = nil)
    hash ||= sign_up_params.to_h
    hash[:display_name] = hash[:user_name] if hash[:display_name].blank?
    self.resource = resource_class.new(hash)
  end
end
