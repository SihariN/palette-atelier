
import WorkspaceShell from "@/components/layout/WorkspaceShell";

export default function AtelierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
