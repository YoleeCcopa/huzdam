# app/models/ability.rb
class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest

    # ------------------------
    # Owner can manage their own UserRoles
    # ------------------------
    can [:create, :update, :destroy], UserRole do |user_role|
      user_role.object.user_id == user.id
    end

    # ------------------------
    # Permissions via UserRoles
    # ------------------------
    user.user_roles.includes(role: :permissions).each do |user_role|
      role   = user_role.role
      object = user_role.object

      role.permissions.each do |permission|
        subject_class = safe_constantize(permission.subject)
        next unless subject_class

        # Grant permission for the specific object
        can permission.action.to_sym, subject_class do |obj|
          # Check if object matches or is a descendant
          obj_accessible?(obj, object)
        end
      end
    end

    # ------------------------
    # DeniedAccess overrides everything
    # ------------------------
    DeniedAccess.where(user_id: user.id).find_each do |denial|
      subject_class = safe_constantize(denial.object_type)
      next unless subject_class

      cannot :manage, subject_class, id: denial.object_id
    end
  end

  private

  # Safely convert a string to a class
  def safe_constantize(subject)
    subject.classify.safe_constantize
  rescue NameError
    nil
  end

  # Check if obj is the object itself or nested within it
  def obj_accessible?(obj, owner_object)
    case owner_object
    when Area
      # Area → Shelf → Container → Item
      owner_object.shelves.exists?(id: obj.id) ||
        owner_object.shelves.joins(:all_containers).exists?(containers: { id: obj.id }) ||
        owner_object.shelves.joins(:all_items).exists?(items: { id: obj.id })
    when Shelf
      # Shelf → Container → Item
      owner_object.containers.exists?(id: obj.id) ||
        owner_object.items.exists?(id: obj.id) ||
        owner_object.containers.joins(:all_items).exists?(items: { id: obj.id })
    when Container
      # Container → Container → Item
      owner_object.containers.exists?(id: obj.id) ||
        owner_object.items.exists?(id: obj.id)
    else
      # Item or others: only itself
      obj.id == owner_object.id
    end
  end
end
