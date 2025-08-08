require_dependency 'object_permissions'  # This ensures the file is loaded.

class Item < ApplicationRecord
  include ObjectPermissions

  belongs_to :parent, polymorphic: true # Can belong to Shelf or Container
  
  validates :custom_label, length: { maximum: 255 }, allow_blank: true
end
