AddCSLuaFile()

SWEP.HoldType              = "crossbow"

if CLIENT then
   SWEP.PrintName          = "S.A.M.P.L.E."
   SWEP.Slot               = 2

   SWEP.ViewModelFlip      = false
   SWEP.ViewModelFOV       = 54

   SWEP.Icon               = "vgui/ttt/icon_m249"
end

SWEP.Base                  = "weapon_tttbase"

SWEP.Spawnable             = true
SWEP.AutoSpawnable         = true

SWEP.Kind                  = WEAPON_HEAVY

SWEP.Primary.Damage        = 7
SWEP.Primary.Delay         = 0.06
SWEP.Primary.Cone          = 0.09
SWEP.Primary.ClipSize      = 150
SWEP.Primary.ClipMax       = 150
SWEP.Primary.DefaultClip   = 150
SWEP.Primary.Automatic     = true
SWEP.Primary.Ammo          = "AirboatGun"
SWEP.Primary.Recoil        = 1.9
SWEP.Primary.Sound         = Sound("Weapon_m249.Single")

SWEP.UseHands              = true
SWEP.ViewModel             = "models/weapons/cstrike/c_mach_m249para.mdl"
SWEP.WorldModel            = "models/weapons/w_mach_m249para.mdl"

SWEP.HeadshotMultiplier    = 2.2

SWEP.IronSightsPos         = Vector(-5.96, -5.119, 2.349)
SWEP.IronSightsAng         = Vector(0, 0, 0)


function SWEP:PrimaryAttack()
   -- Checks if we have enough ammo to shoot
   if not self:CanPrimaryAttack() then return end

   -- weapon_tttbase: SWEP:ShootBullet(damage, recoil, numberOfBullets, cone)
   -- Shoots a bullet, handles player/weapon animations & applies recoil
   self:ShootBullet(
      self.Primary.Damage,
      self.Primary.Recoil,
      self.Primary.NumShots,
      self:GetPrimaryCone()
   )

   self:TakePrimaryAmmo(self.Primary.NumShots)

   self:EmitSound(self.Primary.Sound)

   self:SetNextPrimaryFire(CurTime() + self.Primary.Delay)
end


function SWEP:SecondaryAttack()
   if self.NoSights or (not self.IronSightsPos) then return end

   self:SetIronsights(not self:GetIronsights())

   self:SetNextSecondaryFire(CurTime() + 0.3)
end
