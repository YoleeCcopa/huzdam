# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new

    # Load user roles with permissions and objects
    user.user_roles.includes(:role => :permissions, :object).each do |user_role|
      role = user_role.role
      object = user_role.object

      role.permissions.each do |permission|
        subject_class = safe_constantize(permission.subject)
        next unless subject_class

        # Grant permission on the specific object
        can permission.action.to_sym, subject_class, id: object.id

        # Cascade logic
        if object.is_a?(Shelf)
          # Containers and Items inside Shelf
          can permission.action.to_sym, Container, shelf_id: object.id
          can permission.action.to_sym, Item, container: { shelf_id: object.id }
        elsif object.is_a?(Container)
          # Items inside Container
          can permission.action.to_sym, Item, container_id: object.id
        end
      end
    end

    # Denied Access Overrides
    DeniedAccess.where(user_id: user.id).each do |denial|
      subject_class = safe_constantize(denial.object_type)
      next unless subject_class

      cannot :manage, subject_class, id: denial.object_id
    end
  end

  private

  def safe_constantize(subject)
    subject.classify.safe_constantize
  rescue NameError
    nil
  end
end
