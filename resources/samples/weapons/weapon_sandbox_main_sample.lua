AddCSLuaFile()

SWEP.Base         = "weapon_base"
SWEP.PrintName    = "AK47"
SWEP.Author       = "Your name here"
SWEP.Instructions = [[Enter a description to let players know
how to use your weapon]]

SWEP.HoldType	= "ar2"
SWEP.Slot      = 1
SWEP.SlotPos   = 0
SWEP.Weight    = 5
SWEP.AutoSwitchTo   = true
SWEP.AutoSwitchFrom = false

SWEP.Spawnable = true
SWEP.AdminSpawnable = true

SWEP.ViewModelFlip = true
SWEP.UseHands = false
SWEP.DrawCrosshair = true

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

SWEP.ViewModelFOV  = 72
SWEP.ViewModel  = "models/weapons/v_rif_ak47.mdl"
SWEP.WorldModel = "models/weapons/w_rif_ak47.mdl"

SWEP.NoSights = false
SWEP.IronSightsPos = Vector( 6.05, -5, 2.4 )
SWEP.IronSightsAng = Vector( 2.2, -0.1, 0 )

