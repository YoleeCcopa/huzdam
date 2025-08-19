require_dependency "object_permissions"  # This ensures the file is loaded.

class Container < ApplicationRecord
  include ObjectPermissions

  has_many :containers, as: :parent
  has_many :items

  # All containers nested inside this container (direct)
  def all_containers
    Container.where(parent_type: "Container", parent_id: id)
  end

  # All items under this container (direct + from child containers)
  def all_items
    Item.where(
      "(parent_type = ? AND parent_id = ?) OR (parent_type = ? AND parent_id IN (?))",
      "Container", id,
      "Container", all_containers.select(:id)
    )
  end
end
