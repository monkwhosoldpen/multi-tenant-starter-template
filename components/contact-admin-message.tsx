import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import useTenant, { TenantProvider } from "@/lib/usetenant";

export function ContactAdminMessage() {
  const { isMaintenanceMode } = useTenant();

  if (isMaintenanceMode) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Card className="w-[420px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🛠️ Maintenance in Progress
            </CardTitle>
            <CardDescription>
              We&apos;re currently performing scheduled maintenance to improve our services.
              Please check back later. We apologize for any inconvenience.
              <div className="mt-4 text-sm">
                <strong>Expected completion:</strong> Within 2 hours
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <>
        <Card className="w-[420px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚠️ No Access Available
            </CardTitle>
            <CardDescription>
              You currently don&apos;t have access to any teams. Please contact your system administrator
              to get access to a team.
              <div className="mt-4 text-sm">
                <strong>Note:</strong> If you believe this is an error, please reach out to support.
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
      </>
    </div>
  );
} 