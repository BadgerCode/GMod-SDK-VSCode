AddCSLuaFile()

SWEP.HoldType              = "pistol"

if CLIENT then
   SWEP.PrintName          = "Sample Pistol"
   SWEP.Slot               = 1

   SWEP.ViewModelFlip      = false
   SWEP.ViewModelFOV       = 54

   SWEP.Icon               = "vgui/ttt/icon_pistol"
end

SWEP.Base                  = "weapon_tttbase"

SWEP.Kind                  = WEAPON_PISTOL

SWEP.Primary.Recoil        = 1.5
SWEP.Primary.Damage        = 25
SWEP.Primary.Delay         = 0.38
SWEP.Primary.Cone          = 0.02
SWEP.Primary.ClipSize      = 20
SWEP.Primary.Automatic     = true
SWEP.Primary.DefaultClip   = 20
SWEP.Primary.ClipMax       = 60
SWEP.Primary.Ammo          = "Pistol"
SWEP.Primary.Sound         = Sound( "Weapon_FiveSeven.Single" )

SWEP.AutoSpawnable         = true
SWEP.AmmoEnt               = "item_ammo_pistol_ttt"

SWEP.UseHands              = true
SWEP.ViewModel             = "models/weapons/cstrike/c_pist_fiveseven.mdl"
SWEP.WorldModel            = "models/weapons/w_pist_fiveseven.mdl"

SWEP.IronSightsPos         = Vector(-5.95, -4, 2.799)
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
