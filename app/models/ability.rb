class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest

    user.user_roles.includes(role: :permissions).each do |user_role|
      role = user_role.role
      object = user_role.object

      role.permissions.each do |permission|
        subject_class = safe_constantize(permission.subject)
        next unless subject_class

        # Grant permission on the specific object
        can permission.action.to_sym, subject_class, id: object.id

        # Cascade permissions if the object responds to `all_items` or `all_containers`
        if object.respond_to?(:all_containers)
          can permission.action.to_sym, Container, id: object.all_containers.select(:id)
        end

        if object.respond_to?(:all_items)
          can permission.action.to_sym, Item, id: object.all_items.select(:id)
        end
      end
    end

    # Denied access overrides
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
