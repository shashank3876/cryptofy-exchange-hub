
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  BellRing,
  CreditCard,
  Key,
  Lock,
  Mail,
  Save,
  Shield,
  User,
} from "lucide-react";

const Settings = () => {
  const { user, signOut } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Profile updated successfully");
      setIsSaving(false);
    }, 1000);
  };

  const handleChangePassword = async () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Password changed successfully");
      setIsSaving(false);
    }, 1000);
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Notification preferences updated");
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <BellRing className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Your email address cannot be changed
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select defaultValue="us">
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="in">India</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc-5">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select a timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-8">
                      (UTC-08:00) Pacific Time
                    </SelectItem>
                    <SelectItem value="utc-7">
                      (UTC-07:00) Mountain Time
                    </SelectItem>
                    <SelectItem value="utc-6">
                      (UTC-06:00) Central Time
                    </SelectItem>
                    <SelectItem value="utc-5">
                      (UTC-05:00) Eastern Time
                    </SelectItem>
                    <SelectItem value="utc-0">
                      (UTC+00:00) Greenwich Mean Time
                    </SelectItem>
                    <SelectItem value="utc+1">
                      (UTC+01:00) Central European Time
                    </SelectItem>
                    <SelectItem value="utc+5.5">
                      (UTC+05:30) Indian Standard Time
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="mt-4"
              >
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <Button
                onClick={handleChangePassword}
                disabled={isSaving}
                className="mt-4"
              >
                {isSaving ? (
                  <>Updating...</>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Key className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Protect your account with an additional security layer
                    </p>
                  </div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Receive a security code via email
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-2">
                  {[
                    {
                      id: "email-price-alerts",
                      label: "Price Alerts",
                      description:
                        "Receive notifications when prices change significantly",
                      defaultChecked: true,
                    },
                    {
                      id: "email-transactions",
                      label: "Transaction Updates",
                      description:
                        "Notifications for buy, sell, and other transactions",
                      defaultChecked: true,
                    },
                    {
                      id: "email-news",
                      label: "Cryptocurrency News",
                      description:
                        "Updates about important news in the crypto world",
                      defaultChecked: false,
                    },
                    {
                      id: "email-marketing",
                      label: "Marketing & Promotions",
                      description:
                        "Special offers, promotions, and platform updates",
                      defaultChecked: false,
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <Label
                          htmlFor={item.id}
                          className="font-medium mb-1 block"
                        >
                          {item.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        id={item.id}
                        defaultChecked={item.defaultChecked}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>
                <div className="space-y-2">
                  {[
                    {
                      id: "push-price-alerts",
                      label: "Price Alerts",
                      description:
                        "Receive real-time notifications for price movements",
                      defaultChecked: true,
                    },
                    {
                      id: "push-transactions",
                      label: "Transaction Updates",
                      description:
                        "Notifications when your transactions are processed",
                      defaultChecked: true,
                    },
                    {
                      id: "push-security",
                      label: "Security Alerts",
                      description:
                        "Important security notifications for your account",
                      defaultChecked: true,
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <Label
                          htmlFor={item.id}
                          className="font-medium mb-1 block"
                        >
                          {item.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        id={item.id}
                        defaultChecked={item.defaultChecked}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSaveNotifications}
                disabled={isSaving}
                className="mt-4"
              >
                {isSaving ? (
                  <>Saving Preferences...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods for buying and selling cryptocurrency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-6 w-6" />
                    <div>
                      <p className="font-medium">Razorpay</p>
                      <p className="text-sm text-muted-foreground">
                        Pay with credit/debit cards, UPI, and more
                      </p>
                    </div>
                  </div>
                  <span className="text-sm px-2 py-1 rounded-full bg-green-500/10 text-green-500">
                    Connected
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  toast.info("Adding a new payment method will be available soon");
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>

              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-medium">Currency Preferences</h3>
                <div className="space-y-2">
                  <Label htmlFor="currency">Display Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select display currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                      <SelectItem value="inr">INR - Indian Rupee</SelectItem>
                      <SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="border-t pt-6">
        <Button
          variant="destructive"
          onClick={() => signOut()}
          className="w-full sm:w-auto"
        >
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default Settings;
