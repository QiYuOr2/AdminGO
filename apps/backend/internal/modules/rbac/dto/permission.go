package dto

import "admingo/internal/modules/rbac/model"

type PermissionDTO struct {
	ID   uint   `json:"id"`
	Path string `json:"path"`
	Code string `json:"code"`
}

func FormModelToPermissionDTO(perm model.Permission) PermissionDTO {
	return PermissionDTO{
		ID:   perm.ID,
		Path: perm.Path,
		Code: perm.Code,
	}
}

func FormModelListToPermissionDTOList(perms []model.Permission) []PermissionDTO {
	dtos := make([]PermissionDTO, len(perms))
	for i, perm := range perms {
		dtos[i] = FormModelToPermissionDTO(perm)
	}
	return dtos
}
