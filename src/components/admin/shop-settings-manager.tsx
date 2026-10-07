"use client"

import { useRef, useState } from "react"
import { ImageUp, Lock, MapPin, Save, Store, Trash2, UserPlus, Users, X } from "lucide-react"
import { toast } from "sonner"

import { LogoMark } from "@/components/brand/logo"
import { PageHeader, Panel, PanelTitle } from "@/components/admin/blocks"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { resizeImage } from "@/lib/image"
import { cn } from "@/lib/utils"
import { brandColors, shopSettings, staffRoles, useShopSettings, type StaffRole } from "@/lib/shop-settings"

export function ShopSettingsManager() {
  const settings = useShopSettings()
  const [shopName, setShopName] = useState(settings.shopName)
  const [address, setAddress] = useState(settings.address)
  const [staffName, setStaffName] = useState("")
  const [staffRole, setStaffRole] = useState<StaffRole>(staffRoles[1])
  const logoInputRef = useRef<HTMLInputElement>(null)

  async function onLogoUpload(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("សូមជ្រើសរើសឯកសាររូបភាព (JPG, PNG, WebP)។")
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("សូមប្រើរូបភាពទំហំក្រោម ៨ MB។")
      return
    }
    try {
      const dataUrl = await resizeImage(file, 256)
      shopSettings.setLogo(dataUrl)
      toast.success("បានរក្សាទុកឡូហ្គោហាង")
    } catch {
      toast.error("មិនអាចអានរូបភាពនេះបានទេ — សូមសាកល្បងឯកសារផ្សេង។")
    }
  }

  function saveShopName() {
    const trimmed = shopName.trim()
    if (!trimmed) {
      toast.error("សូមបញ្ចូលឈ្មោះហាង។")
      return
    }
    shopSettings.setShopName(trimmed)
    toast.success("បានរក្សាទុកឈ្មោះហាង")
  }

  function saveAddress() {
    const trimmed = address.trim()
    if (!trimmed) {
      toast.error("សូមបញ្ចូលទីតាំងហាង។")
      return
    }
    shopSettings.setAddress(trimmed)
    toast.success("បានរក្សាទុកទីតាំងហាង")
  }

  function saveBrandColor(hex: string) {
    shopSettings.setBrandColor(hex)
    toast.success("បានរក្សាទុកពណ៌ម៉ាកយីហោ")
  }

  function toggleOpen(isOpen: boolean) {
    shopSettings.setOpen(isOpen)
    toast.success(isOpen ? "ហាងបានបើកហើយ" : "ហាងបានបិទហើយ")
  }

  function addStaff() {
    const trimmed = staffName.trim()
    if (!trimmed) {
      toast.error("សូមបញ្ចូលឈ្មោះបុគ្គលិក។")
      return
    }
    shopSettings.addStaff(trimmed, staffRole)
    toast.success(`បានបន្ថែម ${trimmed} ជា ${staffRole}`)
    setStaffName("")
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader
        eyebrow="ប្រតិបត្តិការហាងកាហ្វេ › ការកំណត់ហាង"
        title="ការកំណត់ហាង"
        description="កែសម្រួលព័ត៌មានហាង និងគ្រប់គ្រងតួនាទីបុគ្គលិក។"
      />

      <Panel>
        <PanelTitle
          eyebrow="ស្ថានភាពហាង"
          title={settings.isOpen ? "ហាងកំពុងបើក" : "ហាងបានបិទ"}
          aside={
            <Badge className={cn("text-label-sm font-bold uppercase", settings.isOpen ? "bg-forest-soft text-forest" : "bg-danger-soft text-danger")}>
              <span className={cn("size-2 rounded-full", settings.isOpen ? "bg-forest" : "bg-danger")} /> {settings.isOpen ? "កំពុងបើក" : "បានបិទ"}
            </Badge>
          }
        />
        <div className="flex gap-2">
          <Button
            type="button"
            disabled={settings.isOpen}
            className="h-10 flex-1 gap-2 rounded-lg hover:bg-amber"
            onClick={() => toggleOpen(true)}
          >
            <Store className="size-4" /> បើកហាង
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!settings.isOpen}
            className="h-10 flex-1 gap-2 rounded-lg bg-oat"
            onClick={() => toggleOpen(false)}
          >
            <Lock className="size-4" /> បិទហាង
          </Button>
        </div>
      </Panel>

      <Panel>
        <PanelTitle eyebrow="ព័ត៌មានហាង" title="ឈ្មោះហាង" />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="shop-name" className="text-label-lg text-ink">
              ឈ្មោះហាង
            </Label>
            <div className="relative">
              <Store className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft" />
              <Input
                id="shop-name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="ឈ្មោះហាងរបស់អ្នក"
                className="h-10 rounded-lg bg-oat-light pl-9 focus-visible:border-amber-bright focus-visible:ring-amber-bright/20"
              />
            </div>
          </div>
          <Button type="button" className="h-10 gap-2 rounded-lg hover:bg-amber" onClick={saveShopName}>
            <Save className="size-4" /> រក្សាទុក
          </Button>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="shop-address" className="text-label-lg text-ink">
              ទីតាំងហាង
            </Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft" />
              <Input
                id="shop-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="អាសយដ្ឋានហាងរបស់អ្នក"
                className="h-10 rounded-lg bg-oat-light pl-9 focus-visible:border-amber-bright focus-visible:ring-amber-bright/20"
              />
            </div>
          </div>
          <Button type="button" className="h-10 gap-2 rounded-lg hover:bg-amber" onClick={saveAddress}>
            <Save className="size-4" /> រក្សាទុក
          </Button>
          <Button
            variant="secondary"
            nativeButton={false}
            className="h-10 gap-2 rounded-lg bg-oat"
            render={
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${settings.lat},${settings.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <MapPin className="size-4 text-amber" /> មើលលើ Google Maps
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <span className="flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-oat-light ring-1 ring-espresso/5">
            <LogoMark className="size-10" />
          </span>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" className="h-10 gap-2 rounded-lg bg-oat" onClick={() => logoInputRef.current?.click()}>
              <ImageUp className="size-4" /> ផ្លាស់ប្តូរឡូហ្គោ
            </Button>
            {settings.logoUrl ? (
              <Button
                type="button"
                variant="ghost"
                className="h-10 gap-2 rounded-lg text-danger hover:bg-danger-soft hover:text-danger"
                onClick={() => {
                  shopSettings.setLogo(null)
                  toast.success("បានលុបឡូហ្គោហាង")
                }}
              >
                <X className="size-4" /> លុបឡូហ្គោ
              </Button>
            ) : null}
          </div>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              void onLogoUpload(e.target.files?.[0])
              e.target.value = ""
            }}
          />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Label htmlFor="brand-color" className="text-label-lg text-ink">
            ពណ៌ម៉ាកយីហោ
          </Label>
          <Select value={settings.brandColor} onValueChange={(v) => v && saveBrandColor(v as string)}>
            <SelectTrigger id="brand-color" className="h-10! w-full rounded-lg bg-oat-light sm:w-64">
              <span className="size-4 shrink-0 rounded-full ring-1 ring-espresso/10" style={{ backgroundColor: settings.brandColor }} />
              <SelectValue>{(v: string) => brandColors.find((c) => c.hex === v)?.label ?? v}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {brandColors.map((c) => (
                <SelectItem key={c.id} value={c.hex}>
                  <span className="size-4 shrink-0 rounded-full ring-1 ring-espresso/10" style={{ backgroundColor: c.hex }} />
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Panel>

      <Panel>
        <PanelTitle eyebrow="បុគ្គលិក" title="បន្ថែមបុគ្គលិក និងកំណត់តួនាទី" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
          <div className="flex flex-col gap-2">
            <Label htmlFor="staff-name" className="text-label-lg text-ink">
              ឈ្មោះបុគ្គលិក
            </Label>
            <Input
              id="staff-name"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="ឧ. Sophia Vance"
              className="h-10 rounded-lg bg-oat-light focus-visible:border-amber-bright focus-visible:ring-amber-bright/20"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="staff-role" className="text-label-lg text-ink">
              តួនាទី
            </Label>
            <Select value={staffRole} onValueChange={(v) => v && setStaffRole(v as StaffRole)}>
              <SelectTrigger id="staff-role" className="h-10! w-full rounded-lg bg-oat-light sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {staffRoles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" className="h-10 gap-2 self-end rounded-lg hover:bg-amber" onClick={addStaff}>
            <UserPlus className="size-4" /> បន្ថែម
          </Button>
        </div>
      </Panel>

      <Panel>
        <PanelTitle
          eyebrow="បញ្ជីបុគ្គលិក"
          title={`បុគ្គលិកសរុប (${settings.staff.length})`}
          aside={<Users className="size-5 text-amber" />}
        />
        {settings.staff.length ? (
          <ul className="flex flex-col gap-2">
            {settings.staff.map((member) => (
              <li
                key={member.id}
                className="flex flex-col gap-3 rounded-2xl bg-white p-3 ring-1 ring-espresso/5 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-title-md text-ink">{member.name}</p>
                <div className="flex items-center gap-2">
                  <Select value={member.role} onValueChange={(v) => v && shopSettings.setStaffRole(member.id, v as StaffRole)}>
                    <SelectTrigger className="h-9 w-full rounded-lg bg-oat-light text-label-md sm:w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {staffRoles.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`លុប ${member.name}`}
                    className="rounded-lg text-danger hover:bg-danger-soft hover:text-danger"
                    onClick={() => {
                      shopSettings.removeStaff(member.id)
                      toast.success(`បានលុប ${member.name} ចេញពីបញ្ជីបុគ្គលិក`)
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body-md text-ink-soft">មិនទាន់មានបុគ្គលិកទេ — បន្ថែមម្នាក់ខាងលើ។</p>
        )}
      </Panel>
    </div>
  )
}
