package dto

import "admingo/internal/modules/menu/model"

type MenuDTO struct {
	ID           uint   `json:"id"`
	ParentID     *uint  `json:"parentId"`
	Title        string `json:"title" binding:"required"`
	Path         string `json:"path" binding:"required"`
	Icon         string `json:"icon"`
	Hidden       bool   `json:"hidden"`
	KeepAlive    bool   `json:"keepAlive"`
	ExternalLink bool   `json:"externalLink"`
}

func FromModelToDTO(menu model.Menu) MenuDTO {
	return MenuDTO{
		ID:           menu.ID,
		ParentID:     menu.ParentID,
		Title:        menu.Title,
		Path:         menu.Path,
		Icon:         menu.Icon,
		Hidden:       menu.Hidden,
		KeepAlive:    menu.KeepAlive,
		ExternalLink: menu.ExternalLink,
	}
}

func FromModelListToDTOList(menus []model.Menu) []MenuDTO {
	dtos := make([]MenuDTO, len(menus))
	for i, menu := range menus {
		dtos[i] = FromModelToDTO(menu)
	}
	return dtos
}
