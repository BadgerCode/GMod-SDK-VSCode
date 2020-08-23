
-- IMPORTANT
-- =========
-- Set this to your file name without the ".lua" on the end
-- Sandbox tools use the filename for storing information and translations
local FileName = "$WEAPON_NAME$"


TOOL.Category = "My Category"
TOOL.Name = "#tool." .. FileName .. ".name"

if CLIENT then
    language.Add("tool." .. FileName .. ".name", "My example tool")
    language.Add("tool." .. FileName .. ".desc", "This is an example tool")
    language.Add("tool." .. FileName .. ".0", "Click to get started")
end


TOOL.ClientConVar["secretmessage"] = "0"



function TOOL:LeftClick(trace)
    if SERVER then
		self:GetOwner():ChatPrint("Left click!")

		local showSecretMessage = self:GetClientNumber("secretmessage") == 1

		if showSecretMessage then
			self:GetOwner():ChatPrint("Here is the secret message!")
		end
	end
end

function TOOL:RightClick(trace)
    if SERVER then
		self:GetOwner():ChatPrint("Right click!")
	end
end

function TOOL:Reload(trace)
    if SERVER then
		self:GetOwner():ChatPrint("Reload!")
	end
end


-- This function/hook is called every frame on client and every tick on the server
function TOOL:Think()
end


-- This controls the part of the UI which shows options for this tool
function TOOL.BuildCPanel(panel)
    panel:AddControl("Header", {
		Text = "#tool." .. FileName .. ".name",
		Description = "#tool." .. FileName .. ".desc"
	})

	panel:AddControl("Checkbox", {
		Label = "Enable secret message for left click",
		Command = FileName .. "_secretmessage"
	})
end
