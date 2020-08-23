AddCSLuaFile()

SWEP.HoldType			= "ar2"

if CLIENT then
   SWEP.PrintName = "AK47"
   SWEP.Slot      = 6

   SWEP.ViewModelFOV  = 72
   SWEP.ViewModelFlip = true

   -- Traitor equipment menu settings
   SWEP.EquipMenuData = {
      type = "item_weapon",
      desc = "Example custom weapon."
   };

   SWEP.Icon = "vgui/ttt/icon_nades"
end

SWEP.Base				= "weapon_tttbase"

SWEP.Primary.Delay       = 0.08
SWEP.Primary.Recoil      = 1.9
SWEP.Primary.Automatic   = true
SWEP.Primary.Damage      = 20
SWEP.Primary.Cone        = 0.025
SWEP.Primary.Ammo        = "smg1"
SWEP.Primary.ClipSize    = 45
SWEP.Primary.ClipMax     = 90
SWEP.Primary.DefaultClip = 45
SWEP.Primary.Sound       = Sound( "Weapon_AK47.Single" )

SWEP.AmmoEnt = "item_ammo_smg1_ttt"

SWEP.UseHands              = true
SWEP.ViewModel  = "models/weapons/v_rif_ak47.mdl"
SWEP.WorldModel = "models/weapons/w_rif_ak47.mdl"

SWEP.NoSights = false
SWEP.IronSightsPos = Vector( 6.05, -5, 2.4 )
SWEP.IronSightsAng = Vector( 2.2, -0.1, 0 )


-- Detective equipment settings

SWEP.Kind = WEAPON_EQUIP1
SWEP.AutoSpawnable = false
SWEP.CanBuy = { ROLE_DETECTIVE }
SWEP.LimitedStock = false
SWEP.AllowDrop = true
SWEP.IsSilent = false



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
