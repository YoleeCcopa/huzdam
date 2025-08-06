class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest

    # Permissions via UserRoles
    user.user_roles.includes(role: :permissions).each do |user_role|
      role   = user_role.role
      object = user_role.object

      role.permissions.each do |permission|
        subject_class = safe_constantize(permission.subject)
        next unless subject_class

        # Grant permission for the object or its nested children
        can permission.action.to_sym, subject_class do |obj|
          cascade_access?(obj, object)
        end
      end
    end

    # DeniedAccess overrides everything
    DeniedAccess.where(user_id: user.id).find_each do |denial|
      subject_class = safe_constantize(denial.object_type)
      next unless subject_class
      cannot :manage, subject_class, id: denial.object_id if denial.hidden
    end
  end

  private

  # Safely convert a string to a class
  def safe_constantize(subject)
    subject.classify.safe_constantize
  rescue NameError
    nil
  end

  # Optimized cascade permission check
  def cascade_access?(obj, owner_object)
    return true if obj.id == owner_object.id

    case owner_object
    when Area
      shelf_ids = owner_object.shelves.pluck(:id)
      container_ids = Container.where(parent_id: shelf_ids, parent_type: "Shelf").pluck(:id)
      item_ids = Item.where(parent_id: shelf_ids + container_ids, parent_type: [ "Shelf", "Container" ]).pluck(:id)
      shelf_ids.include?(obj.id) || container_ids.include?(obj.id) || item_ids.include?(obj.id)
    when Shelf
      container_ids = owner_object.containers.pluck(:id)
      item_ids = Item.where(parent_id: [ owner_object.id ] + container_ids, parent_type: [ "Shelf", "Container" ]).pluck(:id)
      container_ids.include?(obj.id) || item_ids.include?(obj.id)
    when Container
      item_ids = Item.where(parent_id: owner_object.id, parent_type: "Container").pluck(:id)
      item_ids.include?(obj.id)
    else
      obj.id == owner_object.id
    end
  end
end
