package dto

import "admingo/internal/modules/rbac/model"

type RoleDTO struct {
	Name        string          `json:"name" binding:"required"`
	Permissions []PermissionDTO `json:"permissions"`
}

func FormModelToRoleDTO(role model.Role) RoleDTO {
	perms := FormModelListToPermissionDTOList(role.Permissions)

	return RoleDTO{
		Name:        role.Name,
		Permissions: perms,
	}
}

func FormModelListToRoleDTOList(roles []model.Role) []RoleDTO {
	dtos := make([]RoleDTO, len(roles))
	for i, role := range roles {
		dtos[i] = FormModelToRoleDTO(role)
	}
	return dtos
}
