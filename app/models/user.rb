class User < ApplicationRecord
  # Important: The order of modules matters
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable,
    :confirmable

  include DeviseTokenAuth::Concerns::User

  has_many :user_roles, dependent: :destroy
  has_many :denied_accesses, dependent: :destroy

  has_many :areas
  has_many :shelves
  has_many :containers
  has_many :items

  belongs_to :role, optional: true # optional global role (if needed)

  validates :user_name, presence: true, uniqueness: true
  validates :display_name, presence: true
  validates :email, presence: true, uniqueness: true
  
  def generate_magic_login_token!
    self.magic_login_token = Devise.friendly_token
    self.magic_login_sent_at = Time.current
    save!
  end

  def magic_login_token_valid?
    magic_login_sent_at > 30.minutes.ago
  end

  def clear_magic_login_token!
    self.magic_login_token = nil
    self.magic_login_sent_at = nil
    save!
  end

  # Shortcut: get a role for a given object
  def role_for(object)
    user_roles.find_by(object: object)&.role
  end

  def denied?(object)
    denied_accesses.exists?(object: object)
  end

  def can_access?(object, action)
    ability = Ability.new(self)
    ability.can?(action, object)
  end
end
