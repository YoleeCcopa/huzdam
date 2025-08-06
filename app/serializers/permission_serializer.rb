class PermissionSerializer < ActiveModel::Serializer
  attributes :action, :subject, :key

  def key
    "#{object.action}_#{object.subject.downcase}"
  end
end
