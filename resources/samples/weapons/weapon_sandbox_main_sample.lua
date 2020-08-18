AddCSLuaFile()

SWEP.Base         = "weapon_base"
SWEP.PrintName    = "AK47-Sample"
SWEP.Category     = "Other"
SWEP.Author       = "Your name here"
SWEP.Instructions = [[Enter a description to let players know
how to use your weapon]]

SWEP.HoldType       = "ar2"
SWEP.Slot           = 1
SWEP.SlotPos        = 0
SWEP.Weight         = 5
SWEP.AutoSwitchTo   = true
SWEP.AutoSwitchFrom = false

SWEP.Spawnable      = true
SWEP.AdminSpawnable = true

SWEP.ViewModelFlip  = true
SWEP.UseHands       = false
SWEP.DrawCrosshair  = true

SWEP.Primary.Delay       = 0.08
SWEP.Primary.Recoil      = 1.9
SWEP.Primary.Automatic   = true
SWEP.Primary.Damage      = 20
SWEP.Primary.Cone        = 0.025
SWEP.Primary.Ammo        = "smg1"
SWEP.Primary.ClipSize    = 45
SWEP.Primary.ClipMax     = 90
SWEP.Primary.DefaultClip = 45
SWEP.Primary.Sound       = Sound("Weapon_AK47.Single")

SWEP.Secondary.Delay       = 1

SWEP.AmmoEnt = "item_ammo_smg1_ttt"

SWEP.ViewModelFOV  = 72
SWEP.ViewModel  = "models/weapons/v_rif_ak47.mdl"
SWEP.WorldModel = "models/weapons/w_rif_ak47.mdl"


function SWEP:PrimaryAttack()
    -- Make sure we can shoot first
    if (self:CanPrimaryAttack() == false) then return end

    self:ShootBullet(self.Primary.Damage, 1, self.Primary.Cone, self.Primary.Ammo)
    self:TakePrimaryAmmo(1)

    -- Shoot animation
    self.Weapon:SendWeaponAnim(ACT_VM_PRIMARYATTACK)
    self.Owner:MuzzleFlash()
    self.Owner:SetAnimation(PLAYER_ATTACK1)

    -- Fire sound
    self.Weapon:EmitSound(Sound(self.Primary.Sound))

    -- Knockback
    if (!self.Owner:IsNPC()) then self.Owner:ViewPunch(Angle(-self.Primary.Recoil, 0, 0 )) end

    -- Delay when the gun can next be fired
    self:SetNextPrimaryFire(CurTime() + self.Primary.Delay)
end


function SWEP:SecondaryAttack()
    if(!self:CanSecondaryAttack()) then return end

    if SERVER then
        self:GetOwner():ChatPrint("Right click!")
    end

    -- Delay when the gun can next be fired (secondary attack)
    self:SetNextSecondaryFire(CurTime() + self.Secondary.Delay)
end

function SWEP:Reload()
    self:DefaultReload(ACT_VM_RELOAD)
    return true
end
