import UserManagementView from '../../features/user/view/UserManagementView'

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <UserManagementView />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'ユーザー管理 | Movie Software',
  description: 'ユーザーの一覧、作成、編集、削除ができます。',
} 