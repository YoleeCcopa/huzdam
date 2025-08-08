require_dependency "object_permissions"  # This ensures the file is loaded.

class Shelf < ApplicationRecord
  include ObjectPermissions

  belongs_to :area
  has_many :containers
  has_many :items

  # All containers under this shelf (direct)
  def all_containers
    Container.where(parent_type: "Shelf", parent_id: id)
  end

  # All items under this shelf (direct + from containers)
  def all_items
    Item.where(
      "(parent_type = ? AND parent_id = ?) OR (parent_type = ? AND parent_id IN (?))",
      "Shelf", id,
      "Container", all_containers.select(:id)
    )
  end
end
