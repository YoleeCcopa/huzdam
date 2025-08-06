class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :display_name, :role, :permissions

  def role
    object.role&.name
  end

  def permissions
    object.role&.permissions&.map { |p| "#{p.action}_#{p.subject}" } || []
  end
end
