require_dependency "object_permissions"  # This ensures the file is loaded.

class Area < ApplicationRecord
  include ObjectPermissions

  has_many :shelves

  # All containers under this area (direct + from shelves)
  # def all_containers
  #   Container.where(parent_type: "Shelf", parent_id: shelves.select(:id))
  # end

  # All items under this area (direct + from shelves + from containers)
  # def all_items
  #   Item.where(
  #     "(parent_type = ? AND parent_id IN (?)) OR (parent_type = ? AND parent_id IN (?))",
  #     "Shelf", shelves.select(:id),
  #     "Container", all_containers.select(:id)
  #   )
  # end
end
