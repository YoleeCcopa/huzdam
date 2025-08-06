class UserRole < ApplicationRecord
  belongs_to :user
  belongs_to :role
  belongs_to :object, polymorphic: true

  validates :user_id, :role_id, :object_type, :object_id, presence: true
  validates :user_id, uniqueness: { scope: [:object_type, :object_id], message: "already has a role for this object" }

  # Hidden flag for hiding objects from invites
  attribute :hidden, :boolean, default: false
end
