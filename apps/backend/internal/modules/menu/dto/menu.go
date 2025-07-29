package dto

import "admingo/internal/modules/menu/model"

type MenuDTO struct {
	ID             uint   `json:"id"`
	ParentID       *uint  `json:"parentId"`
	Title          string `json:"title" binding:"required"`
	Path           string `json:"path" binding:"required"`
	Icon           string `json:"icon"`
	Hidden         bool   `json:"hidden"`
	KeepAlive      bool   `json:"keepAlive"`
	ExternalLink   bool   `json:"externalLink"`
	Sort           int    `json:"sort"`
	PermissionCode string `json:"permissionCode"`
}

func FromModelToDTO(menu model.Menu) MenuDTO {
	return MenuDTO{
		ID:             menu.ID,
		ParentID:       menu.ParentID,
		Title:          menu.Title,
		Path:           menu.Path,
		Icon:           menu.Icon,
		Hidden:         menu.Hidden,
		KeepAlive:      menu.KeepAlive,
		ExternalLink:   menu.ExternalLink,
		Sort:           menu.Sort,
		PermissionCode: menu.PermissionCode,
	}
}

func FromModelListToDTOList(menus []model.Menu) []MenuDTO {
	dtos := make([]MenuDTO, len(menus))
	for i, menu := range menus {
		dtos[i] = FromModelToDTO(menu)
	}
	return dtos
}

func FromDTOToModel(dto MenuDTO) model.Menu {
	return model.Menu{
		Title:          dto.Title,
		Path:           dto.Path,
		Icon:           dto.Icon,
		ParentID:       dto.ParentID,
		Sort:           dto.Sort,
		Hidden:         dto.Hidden,
		PermissionCode: dto.PermissionCode,
		ExternalLink:   dto.ExternalLink,
		KeepAlive:      dto.KeepAlive,
	}
}
