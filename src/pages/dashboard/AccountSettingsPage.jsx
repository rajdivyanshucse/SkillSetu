import React, { useState } from 'react';
import { User, Shield, Key, LogOut, Laptop, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsSaveBar from '../../components/settings/SettingsSaveBar';
import DangerZone from '../../components/settings/DangerZone';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal, { ConfirmDialog } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { getStoredSettings, saveSettings } from '../../utils/settingsIntelligence';

export const AccountSettingsPage = () => {
  const { addToast } = useToast();
  const initialSettings = getStoredSettings();

  const [account, setAccount] = useState(initialSettings.account);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (field, value) => {
    setAccount((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveSettings({ account });
      setIsSaving(false);
      setHasChanges(false);
      addToast({
        title: 'Account Information Updated',
        message: 'Your personal profile details have been saved to local workspace context.',
        type: 'success',
      });
    }, 400);
  };

  const handleCancel = () => {
    setAccount(initialSettings.account);
    setHasChanges(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      addToast({
        title: 'Password Mismatch',
        message: 'New passwords do not match. Please verify your input.',
        type: 'warning',
      });
      return;
    }

    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    addToast({
      title: 'Password Changed (Simulated)',
      message: 'Your account access credentials have been updated in prototype session memory.',
      type: 'success',
    });
  };

  const handleSignOutOtherSessions = () => {
    setAccount((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((s) => s.current),
    }));
    addToast({
      title: 'Other Sessions Terminated',
      message: 'All secondary sessions have been revoked.',
      type: 'info',
    });
  };

  const handleSignOut = () => {
    addToast({
      title: 'Sign Out (Simulated)',
      message: 'You have been signed out in prototype mode.',
      type: 'info',
    });
  };

  return (
    <SettingsLayout activeRoute="/dashboard/settings/account">
      <div className="space-y-6">
        <SettingsHeader
          title="Personal Information"
          subtitle="Manage your contact information, account tier, active device sessions, and security credentials."
          backUrl="/dashboard/settings"
          backLabel="Back to Settings Hub"
        />

        {/* Profile Information Form */}
        <SettingsSection
          title="Profile Information"
          description="Basic personal and contact details used across your SkillSetu calibration."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={account.fullName || ''}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="e.g. Arjun Mehta"
            />
            <Input
              label="Email Address"
              type="email"
              value={account.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="e.g. arjun.mehta@example.com"
            />
            <Input
              label="Phone Number"
              value={account.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="e.g. +91 98765 43210"
            />
            <Input
              label="Current Location"
              value={account.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Bengaluru, Karnataka, India"
            />
          </div>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-canvas-subtle border border-surface-border">
              <span className="text-[11px] text-charcoal-500 font-mono uppercase">Account Type</span>
              <div className="text-body-sm font-semibold text-charcoal-900 mt-0.5">
                {account.accountType}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-canvas-subtle border border-surface-border">
              <span className="text-[11px] text-charcoal-500 font-mono uppercase">Member Since</span>
              <div className="text-body-sm font-semibold text-charcoal-900 mt-0.5">
                {account.memberSince}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-canvas-subtle border border-surface-border">
              <span className="text-[11px] text-charcoal-500 font-mono uppercase">Status</span>
              <div className="text-body-sm font-semibold text-emerald-700 mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {account.accountStatus}
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Account Access & Security */}
        <SettingsSection
          title="Account Access & Credentials"
          description="Manage your password and review active browser logins."
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-canvas-subtle border border-surface-border">
            <div className="space-y-0.5">
              <h4 className="text-body-sm font-bold text-charcoal-900">Account Password</h4>
              <p className="text-caption text-charcoal-500">
                Last updated 3 months ago. We recommend regular password rotations.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasswordModal(true)}
              className="shrink-0 self-start sm:self-center"
            >
              <Key className="w-3.5 h-3.5 mr-1.5" />
              Change Password
            </Button>
          </div>

          {/* Active Sessions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-body-sm font-bold text-charcoal-900">
                Active Browser Sessions ({account.sessions?.length || 1})
              </h4>
              <button
                type="button"
                onClick={handleSignOutOtherSessions}
                className="text-xs font-semibold text-brand-700 hover:text-brand-900 cursor-pointer"
              >
                Sign Out All Other Sessions
              </button>
            </div>

            <div className="space-y-2">
              {account.sessions?.map((sess) => (
                <div
                  key={sess.id}
                  className="p-3.5 rounded-xl border border-surface-border bg-white flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-canvas-subtle text-charcoal-600">
                      {sess.device.includes('iPhone') ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Laptop className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-body-sm font-semibold text-charcoal-900">
                          {sess.device}
                        </span>
                        {sess.current && (
                          <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px]">
                            Current Session
                          </Badge>
                        )}
                      </div>
                      <div className="text-[11px] text-charcoal-500 font-mono">
                        {sess.location} • {sess.ip} • Last active: {sess.lastActive}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SettingsSection>

        {/* Save Bar */}
        <SettingsSaveBar
          hasChanges={hasChanges}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={isSaving}
        />

        {/* Account Actions Danger Zone */}
        <DangerZone
          actions={[
            {
              id: 'signout-all',
              title: 'Sign Out All Devices',
              description: 'Revoke active authentication cookies across all desktop and mobile devices.',
              buttonText: 'Sign Out Everywhere',
              isDestructive: true,
              onConfirm: handleSignOutOtherSessions,
              confirmTitle: 'Sign Out All Devices?',
              confirmMessage: 'Are you sure you want to invalidate all active session tokens?',
            },
            {
              id: 'signout-current',
              title: 'Sign Out Current Session',
              description: 'End your current active SkillSetu workspace session.',
              buttonText: 'Sign Out',
              isDestructive: false,
              onConfirm: handleSignOut,
              confirmTitle: 'Sign Out?',
              confirmMessage: 'Are you sure you want to end your current session?',
            },
          ]}
        />

        {/* Change Password Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          size="sm"
          title="Change Password (Simulated)"
        >
          <form onSubmit={handleChangePassword} className="space-y-4">
            <p className="text-caption text-charcoal-500">
              Update your account password. In this prototype, changes are validated and recorded locally.
            </p>

            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Update Password
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </SettingsLayout>
  );
};

export default AccountSettingsPage;
