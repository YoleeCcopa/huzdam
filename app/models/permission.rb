class Permission < ApplicationRecord
  has_many :permissions_roles
  has_many :roles, through: :permissions_roles

  validates :action, presence: true
  validates :subject, presence: true
end
