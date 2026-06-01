import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Link,
  Navigate,
  Outlet,
  RouteObject,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  Activity,
  BarChart3,
  KeyRound,
  LogOut,
  MessageSquare,
  Shield,
  UserRound,
} from 'lucide-react';
import { api, type Admin } from './api';
import { Badge, Button, Card, Input, Table, Td, Textarea, Th } from './components/ui';
import { cn, formatDate } from './lib/utils';

type LoadState<T> =
  | { loading: true; data?: undefined; error?: undefined }
  | { loading: false; data: T; error?: undefined }
  | { loading: false; data?: undefined; error: Error };

function useLoad<T>(load: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<LoadState<T>>({ loading: true });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ loading: true });
    load()
      .then((data) => active && setState({ loading: false, data }))
      .catch((error) => active && setState({ loading: false, error }));
    return () => {
      active = false;
    };
  }, [...deps, reloadKey]);

  return { ...state, reload: () => setReloadKey((key) => key + 1) };
}

function AuthPage() {
  const navigate = useNavigate();
  const [inviteToken, setInviteToken] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setMessage('');
    try {
      await action();
      navigate('/');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '요청에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  }

  async function join(event: FormEvent) {
    event.preventDefault();
    await run(() => api.join({ inviteToken, displayName }));
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-5xl items-center gap-6 px-5 py-10 md:grid-cols-[0.9fr_1.1fr]">
      <section>
        <Badge className="mb-4">Mini Dice Backoffice</Badge>
        <h1 className="text-4xl font-semibold tracking-normal">관리자 대시보드</h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
          서비스 댓글, 사용자, 활동, 초대 코드, 집계 지표를 한 곳에서 확인합니다.
          관리자 로그인과 가입은 패스키로만 진행됩니다.
        </p>
      </section>

      <div className="space-y-4">
        <Card>
          <h2 className="text-xl font-semibold">패스키로 로그인</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            등록된 관리자 패스키가 있는 브라우저에서 로그인합니다.
          </p>
          <Button className="mt-5 w-full" disabled={busy} onClick={() => run(api.login)}>
            <KeyRound className="mr-2 h-4 w-4" />
            로그인
          </Button>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">초대 코드로 가입</h2>
          <form className="mt-4 space-y-3" onSubmit={join}>
            <Input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="관리자 이름"
              required
            />
            <Textarea
              value={inviteToken}
              onChange={(event) => setInviteToken(event.target.value)}
              placeholder="초대 JWT"
              required
            />
            <Button className="w-full" disabled={busy}>
              패스키 등록하고 가입
            </Button>
          </form>
        </Card>

        {message ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {message}
          </div>
        ) : null}
      </div>
    </main>
  );
}

function ProtectedLayout() {
  const { data, loading, error, reload } = useLoad(() => api.me(), []);
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) return <div className="p-8 text-sm text-muted-foreground">불러오는 중...</div>;
  if (error) return <Navigate to="/login" replace />;

  const navItems = [
    { to: '/', label: '개요', icon: BarChart3 },
    { to: '/comments', label: '댓글', icon: MessageSquare },
    { to: '/activities', label: '활동', icon: Activity },
    { to: '/users', label: '사용자', icon: UserRound },
    { to: '/invites', label: '초대', icon: KeyRound },
    { to: '/analytics', label: '분석', icon: BarChart3 },
  ];

  async function logout() {
    await api.logout();
    reload();
    navigate('/login');
  }

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-white px-4 py-5 md:block">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Shield className="h-5 w-5 text-primary" />
          Mini Dice Admin
        </div>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground',
                  active && 'bg-muted text-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 border-b border-border bg-white/95 px-5 py-3 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">관리자</p>
              <p className="font-medium">{data.admin.displayName}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-5 py-6">
          <Outlet context={{ admin: data.admin, reloadMe: reload }} />
        </main>
      </div>
    </div>
  );
}

function DashboardPage() {
  const { data, loading, reload } = useLoad(async () => {
    const [users, comments, activity] = await Promise.all([
      api.list<{ items: any[] }>('/admin/users?limit=10'),
      api.list<{ items: any[] }>('/admin/comments?limit=10'),
      api.list<{ items: any[] }>('/admin/analytics/activity-trend'),
    ]);
    return { users, comments, activity };
  }, []);

  if (loading || !data) return <PageShell title="개요" />;
  const activeUsers = data.activity.items.reduce(
    (sum, item) => sum + Number(item.activeUserCount ?? 0),
    0,
  );

  return (
    <PageShell
      title="개요"
      action={<Button onClick={reload}>새로고침</Button>}
      description="최근 사용자, 댓글, 활동 집계 상태를 빠르게 확인합니다."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="최근 사용자" value={data.users.items.length} />
        <MetricCard label="최근 댓글" value={data.comments.items.length} />
        <MetricCard label="집계 활성 사용자 합계" value={activeUsers} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <RecentComments comments={data.comments.items} />
        <ActivityBars items={data.activity.items.slice(-24)} />
      </div>
    </PageShell>
  );
}

function CommentsPage() {
  const [q, setQ] = useState('');
  const { data, loading, reload } = useLoad(
    () => api.list<{ items: any[] }>(`/admin/comments?limit=50&q=${encodeURIComponent(q)}`),
    [q],
  );

  async function edit(id: string, current: string) {
    const next = window.prompt('댓글 수정', current);
    if (next == null) return;
    await api.patch(`/admin/comments/${id}`, { comment: next });
    reload();
  }

  async function remove(id: string) {
    if (!window.confirm('댓글을 삭제할까요?')) return;
    await api.delete(`/admin/comments/${id}`);
    reload();
  }

  return (
    <PageShell title="댓글" description="댓글을 검색, 수정, 삭제합니다.">
      <Toolbar value={q} onChange={setQ} placeholder="댓글 또는 사용자 검색" />
      {loading || !data ? null : (
        <Table>
          <thead>
            <tr>
              <Th>작성자</Th>
              <Th>칸</Th>
              <Th>댓글</Th>
              <Th>작성일</Th>
              <Th>작업</Th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id}>
                <Td>{item.username}</Td>
                <Td>{item.landId}</Td>
                <Td>{item.comment}</Td>
                <Td>{formatDate(item.createdAt)}</Td>
                <Td className="space-x-2 whitespace-nowrap">
                  <Button size="sm" variant="outline" onClick={() => edit(item.id, item.comment)}>
                    수정
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(item.id)}>
                    삭제
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </PageShell>
  );
}

function ActivitiesPage() {
  const { data, loading, reload } = useLoad(
    () => api.list<{ items: any[] }>('/admin/activities?limit=80'),
    [],
  );
  return (
    <PageShell title="활동" action={<Button onClick={reload}>새로고침</Button>}>
      {!loading && data && (
        <Table>
          <thead>
            <tr>
              <Th>사용자</Th>
              <Th>라우트</Th>
              <Th>읽음</Th>
              <Th>일시</Th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id}>
                <Td>{item.username}</Td>
                <Td>{item.skillRoute}</Td>
                <Td>{item.read ? '예' : '아니오'}</Td>
                <Td>{formatDate(item.createdAt)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </PageShell>
  );
}

function UsersPage() {
  const [q, setQ] = useState('');
  const { data, loading, reload } = useLoad(
    () => api.list<{ items: any[] }>(`/admin/users?limit=50&q=${encodeURIComponent(q)}`),
    [q],
  );

  async function edit(item: any) {
    const username = window.prompt('사용자 이름', item.username);
    if (!username) return;
    const countryCode3 = window.prompt('국가 코드(3자리)', item.countryCode3) ?? item.countryCode3;
    await api.patch(`/admin/users/${item.userId}`, { username, countryCode3 });
    reload();
  }

  async function ban(item: any) {
    const path = item.isTerminated ? 'unban' : 'ban';
    await api.post(`/admin/users/${item.userId}/${path}`);
    reload();
  }

  return (
    <PageShell title="사용자" description="사용자를 검색하고 정보를 수정하거나 차단합니다.">
      <Toolbar value={q} onChange={setQ} placeholder="이름 또는 이메일 검색" />
      {!loading && data && (
        <Table>
          <thead>
            <tr>
              <Th>이름</Th>
              <Th>인증</Th>
              <Th>국가</Th>
              <Th>상태</Th>
              <Th>가입일</Th>
              <Th>작업</Th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.userId}>
                <Td>{item.username}</Td>
                <Td>{item.authProvider}</Td>
                <Td>{item.countryCode3}</Td>
                <Td>{item.isTerminated ? <Badge>차단됨</Badge> : '정상'}</Td>
                <Td>{formatDate(item.createdAt)}</Td>
                <Td className="space-x-2 whitespace-nowrap">
                  <Button size="sm" variant="outline" onClick={() => edit(item)}>
                    수정
                  </Button>
                  <Button
                    size="sm"
                    variant={item.isTerminated ? 'secondary' : 'destructive'}
                    onClick={() => ban(item)}
                  >
                    {item.isTerminated ? '해제' : '차단'}
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </PageShell>
  );
}

function InvitesPage() {
  const [hours, setHours] = useState(24);
  const [token, setToken] = useState('');
  const { data, loading, reload } = useLoad(
    () => api.list<{ items: any[] }>('/admin/invites'),
    [],
  );

  async function createInvite() {
    const result = await api.post<{ invite: { token: string } }>('/admin/invites', {
      expiresInHours: hours,
    });
    setToken(result.invite.token);
    reload();
  }

  async function revoke(id: string) {
    await api.post(`/admin/invites/${id}/revoke`);
    reload();
  }

  return (
    <PageShell title="초대 코드" description="관리자 가입용 JWT 초대 코드를 생성하고 폐기합니다.">
      <Card className="mb-5">
        <div className="flex flex-wrap items-end gap-3">
          <label className="block min-w-[180px] flex-1 text-sm font-medium">
            만료 시간
            <Input
              className="mt-2"
              type="number"
              min={1}
              max={720}
              value={hours}
              onChange={(event) => setHours(Number(event.target.value))}
            />
          </label>
          <Button onClick={createInvite}>초대 코드 생성</Button>
        </div>
        {token ? (
          <Textarea className="mt-4 font-mono text-xs" readOnly value={token} />
        ) : null}
      </Card>

      {!loading && data && (
        <Table>
          <thead>
            <tr>
              <Th>상태</Th>
              <Th>생성자</Th>
              <Th>사용자</Th>
              <Th>만료</Th>
              <Th>생성일</Th>
              <Th>작업</Th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => {
              const status = item.revokedAt ? '폐기됨' : item.usedAt ? '사용됨' : '사용 가능';
              return (
                <tr key={item.id}>
                  <Td>
                    <Badge>{status}</Badge>
                  </Td>
                  <Td>{item.createdBy ?? '-'}</Td>
                  <Td>{item.usedBy ?? '-'}</Td>
                  <Td>{formatDate(item.expiresAt)}</Td>
                  <Td>{formatDate(item.createdAt)}</Td>
                  <Td>
                    {!item.usedAt && !item.revokedAt ? (
                      <Button size="sm" variant="outline" onClick={() => revoke(item.id)}>
                        폐기
                      </Button>
                    ) : null}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </PageShell>
  );
}

function AnalyticsPage() {
  const [days, setDays] = useState(3);
  const { data, loading, reload } = useLoad(async () => {
    const [activity, joins, comments, streak] = await Promise.all([
      api.list<{ items: any[] }>('/admin/analytics/activity-trend'),
      api.list<{ items: any[] }>('/admin/analytics/join-trend'),
      api.list<{ items: any[] }>('/admin/analytics/comment-trend'),
      api.list<{ userCount: number }>(`/admin/analytics/streaks?days=${days}`),
    ]);
    return { activity, joins, comments, streak };
  }, [days]);

  async function refresh() {
    await api.post('/admin/analytics/refresh');
    reload();
  }

  return (
    <PageShell
      title="분석"
      description="Postgres 사전 집계 테이블을 읽어 추세를 표시합니다."
      action={<Button onClick={refresh}>집계 새로고침</Button>}
    >
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <MetricCard
          label={`${days}일 연속 활동 사용자`}
          value={loading || !data ? '-' : data.streak.userCount}
        />
        <Card>
          <label className="text-sm font-medium">
            연속 활동 기준일
            <Input
              className="mt-2"
              type="number"
              min={1}
              max={365}
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
            />
          </label>
        </Card>
      </div>
      {!loading && data && (
        <div className="grid gap-5 xl:grid-cols-3">
          <ActivityBars title="활동" items={data.activity.items.slice(-48)} />
          <SimpleList
            title="가입 추세"
            items={data.joins.items.slice(-12).map((item) => ({
              label: `${formatDate(item.hourBucket)} · ${item.authProvider}/${item.countryCode3}`,
              value: item.joinCount,
            }))}
          />
          <SimpleList
            title="댓글 추세"
            items={data.comments.items.slice(-12).map((item) => ({
              label: formatDate(item.hourBucket),
              value: item.commentCount,
            }))}
          />
        </div>
      )}
    </PageShell>
  );
}

function PageShell({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">{title}</h1>
          {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </>
  );
}

function Toolbar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="mb-4 max-w-md">
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </Card>
  );
}

function RecentComments({ comments }: { comments: any[] }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold">최근 댓글</h2>
      <div className="mt-4 space-y-3">
        {comments.map((item) => (
          <div key={item.id} className="border-b border-border pb-3 last:border-0">
            <p className="text-sm font-medium">{item.username}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.comment}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ActivityBars({
  items,
  title = '활동 추세',
}: {
  items: any[];
  title?: string;
}) {
  const max = useMemo(
    () => Math.max(1, ...items.map((item) => Number(item.activityCount ?? 0))),
    [items],
  );
  return (
    <Card>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 flex h-56 items-end gap-1">
        {items.map((item) => {
          const value = Number(item.activityCount ?? 0);
          return (
            <div
              key={item.hourBucket}
              className="min-w-[8px] flex-1 rounded-t bg-primary"
              title={`${formatDate(item.hourBucket)} · ${value}`}
              style={{ height: `${Math.max(4, (value / max) * 100)}%` }}
            />
          );
        })}
      </div>
    </Card>
  );
}

function SimpleList({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: React.ReactNode }[];
}) {
  return (
    <Card>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function App() {
  return <Outlet />;
}

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'comments', element: <CommentsPage /> },
      { path: 'activities', element: <ActivitiesPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'invites', element: <InvitesPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
    ],
  },
];
