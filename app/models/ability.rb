# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new

    # Load all object-scoped roles for the user
    user.user_roles.includes(role: :permissions, object: []).each do |user_role|
      role = user_role.role
      object = user_role.object

      role.permissions.each do |permission|
        subject_class = safe_constantize(permission.subject)
        next unless subject_class

        # Grant permission on the specific object
        can permission.action.to_sym, subject_class, id: object.id

        # Cascade logic
        case object
        when Area
          # Access all shelves inside this Area
          can permission.action.to_sym, Shelf, area_id: object.id
          # Access all containers and items inside those shelves
          can permission.action.to_sym, Container, parent: Shelf.where(area_id: object.id)
          can permission.action.to_sym, Item, parent: Container.joins("JOIN shelves ON containers.parent_id = shelves.id AND containers.parent_type = 'Shelf'").where(shelves: { area_id: object.id })
        when Shelf
          # Access containers and items inside the Shelf
          can permission.action.to_sym, Container, parent: object
          can permission.action.to_sym, Item, parent: Container.where(parent: object)
        when Container
          # Access nested containers and items
          can permission.action.to_sym, Container, parent: object
          can permission.action.to_sym, Item, parent: object
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

  # Convert string like "shelf" into Shelf constant safely
  def safe_constantize(subject)
    subject.classify.safe_constantize
  rescue NameError
    nil
  end
end
