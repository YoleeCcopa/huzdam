module ObjectPermissions
  extend ActiveSupport::Concern

  included do
    belongs_to :user  # The owner
    belongs_to :parent, polymorphic: true, optional: true # The object this belongs to, e.g., Area, Shelf, Container, etc.

    has_many :user_roles, as: :object
    has_many :users, through: :user_roles

    validates :name, presence: true

    def editable_by?(user)
      user == self.user || has_permission?(user)
    end

    def deletable_by?(user)
      user == self.user || has_permission?(user)
    end

    private

    # Check if the user has permission (could be based on invitee role)
    def has_permission?(user)
      if user_roles.exists?(user_id: user.id)
        Rails.logger.debug("User #{user.id} has permission for this object.")
      else
        Rails.logger.debug("User #{user.id} does not have permission for this object.")
      end
      user_roles.exists?(user_id: user.id)
    end
  end
end
