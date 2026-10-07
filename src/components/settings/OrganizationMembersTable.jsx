import React, { useState } from 'react';
import { Users, UserPlus, MoreVertical, ShieldCheck, Mail, Trash2, Edit3, CheckCircle2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal, { ConfirmDialog } from '../ui/Modal';
import Input from '../ui/Input';
import { Select } from '../ui/Select';
import { useToast } from '../ui/Toast';

export const OrganizationMembersTable = ({
  members = [],
  onUpdateMembers,
}) => {
  const { addToast } = useToast();
  const [memberList, setMemberList] = useState(members);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Invite state
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Viewer');

  // Role edit state
  const [newRole, setNewRole] = useState('Viewer');

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) {
      addToast({
        title: 'Fields required',
        message: 'Please provide both a name and valid corporate email address.',
        type: 'warning',
      });
      return;
    }

    const newMember = {
      id: `mem-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      access: `${inviteRole} Permissions`,
      status: 'Invited',
      lastActive: 'Pending Acceptance',
      avatar: inviteName.slice(0, 2).toUpperCase(),
    };

    const updated = [...memberList, newMember];
    setMemberList(updated);
    onUpdateMembers && onUpdateMembers(updated);
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
    addToast({
      title: 'Invitation Sent',
      message: `Simulated invitation dispatched to ${inviteEmail}.`,
      type: 'success',
    });
  };

  const handleUpdateRole = () => {
    if (!selectedMember) return;
    const updated = memberList.map((m) =>
      m.id === selectedMember.id ? { ...m, role: newRole, access: `${newRole} Permissions` } : m
    );
    setMemberList(updated);
    onUpdateMembers && onUpdateMembers(updated);
    setShowRoleModal(false);
    addToast({
      title: 'Role Updated',
      message: `Permissions for ${selectedMember.name} updated to ${newRole}.`,
      type: 'success',
    });
  };

  const handleRemoveMember = () => {
    if (!selectedMember) return;
    const updated = memberList.filter((m) => m.id !== selectedMember.id);
    setMemberList(updated);
    onUpdateMembers && onUpdateMembers(updated);
    setShowRemoveConfirm(false);
    addToast({
      title: 'Member Removed',
      message: `${selectedMember.name} has been removed from this organization workspace.`,
      type: 'info',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-body-md font-bold text-charcoal-900 font-serif">
            Workspace Members ({memberList.length})
          </h3>
          <p className="text-body-sm text-charcoal-500 mt-0.5">
            Manage authorized collaborators, role permissions, and workforce planning access.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowInviteModal(true)}
          className="self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5 mr-1.5" />
          Invite Colleague
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card className="border-surface-border bg-surface overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas-subtle/80 border-b border-surface-border text-charcoal-500 font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 font-semibold">Member</th>
                <th className="p-3.5 font-semibold">Role</th>
                <th className="p-3.5 font-semibold">Access Scope</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Last Active</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {memberList.map((member) => (
                <tr key={member.id} className="hover:bg-canvas-subtle/30 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {member.avatar || member.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-charcoal-900">{member.name}</div>
                        <div className="text-[11px] text-charcoal-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <Badge variant="outline" className="text-[10px] bg-stone-50 text-charcoal-700 font-medium">
                      {member.role}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-charcoal-600">{member.access}</td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        member.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {member.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-charcoal-500 font-mono text-[11px]">{member.lastActive}</td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMember(member);
                          setNewRole(member.role);
                          setShowRoleModal(true);
                        }}
                        className="p-1.5 rounded hover:bg-canvas-subtle text-charcoal-500 hover:text-charcoal-900 transition-colors cursor-pointer"
                        title="Change Role"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMember(member);
                          setShowRemoveConfirm(true);
                        }}
                        className="p-1.5 rounded hover:bg-red-50 text-charcoal-400 hover:text-status-danger-text transition-colors cursor-pointer"
                        title="Remove Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {memberList.map((member) => (
          <Card key={member.id} className="p-4 border-surface-border bg-surface space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs shrink-0">
                  {member.avatar || member.name.slice(0, 2)}
                </div>
                <div>
                  <h4 className="text-body-sm font-semibold text-charcoal-900">{member.name}</h4>
                  <p className="text-caption text-charcoal-500">{member.email}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {member.role}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-caption text-charcoal-600 border-t border-surface-border pt-2.5">
              <span>{member.access}</span>
              <span className="font-mono text-[11px]">{member.lastActive}</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border/60">
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  setSelectedMember(member);
                  setNewRole(member.role);
                  setShowRoleModal(true);
                }}
              >
                Change Role
              </Button>
              <Button
                variant="destructive"
                size="xs"
                onClick={() => {
                  setSelectedMember(member);
                  setShowRemoveConfirm(true);
                }}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        size="md"
        title="Invite Team Member"
      >
        <form onSubmit={handleSendInvite} className="space-y-4">
          <p className="text-caption text-charcoal-500">
            Send a prototype workspace invitation with pre-configured access permissions.
          </p>

          <Input
            label="Full Name"
            placeholder="e.g. Kavita Menon"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
            required
          />

          <Input
            label="Corporate Email"
            placeholder="kavita.m@company.com"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="text-body-sm font-semibold text-charcoal-900 block">
              Workspace Role
            </label>
            <Select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              options={[
                'Administrator',
                'Workforce Planner',
                'HR / Talent Lead',
                'Technical Recruiter',
                'Viewer',
              ]}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Dispatch Invite
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Role Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        size="sm"
        title={`Change Role: ${selectedMember?.name}`}
      >
        <div className="space-y-4">
          <p className="text-caption text-charcoal-500">
            Select updated workspace permissions for {selectedMember?.email}.
          </p>

          <Select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            options={[
              'Administrator',
              'Workforce Planner',
              'HR / Talent Lead',
              'Technical Recruiter',
              'Viewer',
            ]}
          />

          <div className="flex items-center justify-end gap-2 pt-3">
            <Button variant="outline" size="sm" onClick={() => setShowRoleModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleUpdateRole}>
              Update Role
            </Button>
          </div>
        </div>
      </Modal>

      {/* Remove Confirmation */}
      <ConfirmDialog
        isOpen={showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(false)}
        onConfirm={handleRemoveMember}
        title="Remove Member?"
        message={`Are you sure you want to remove ${selectedMember?.name} from this organization workspace? They will lose access to workforce dashboards and candidate shortlists.`}
        confirmText="Remove Member"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default OrganizationMembersTable;
