package dto

import "admingo/internal/modules/rbac/model"

type RoleDTO struct {
	ID          uint            `json:"id"`
	Name        string          `json:"name" binding:"required"`
	Permissions []PermissionDTO `json:"permissions"`
}

type RoleListDTO struct {
	Total int64     `json:"total"`
	List  []RoleDTO `json:"list"`
}

func FormModelToRoleDTO(role model.Role) RoleDTO {
	perms := FormModelListToPermissionDTOList(role.Permissions)

	return RoleDTO{
		ID:          role.ID,
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
