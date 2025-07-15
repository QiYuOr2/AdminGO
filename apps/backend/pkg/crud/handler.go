package crud

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Handler[T any] struct {
	Service   *Service[T]
	Responder Responder
}

func NewHandler[T any](service *Service[T], responder Responder) *Handler[T] {
	if responder == nil {
		panic("responder cannot be nil")
	}
	return &Handler[T]{
		Service:   service,
		Responder: responder,
	}
}

func (h *Handler[T]) Create(c *gin.Context) {
	var entity T
	if err := c.ShouldBindJSON(&entity); err != nil {
		h.Responder.Error(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := h.Service.Create(&entity); err != nil {
		h.Responder.Error(c, http.StatusInternalServerError, "Failed to create entity")
		return
	}

	h.Responder.Success(c, http.StatusCreated, entity)
}

func (h *Handler[T]) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		h.Responder.Error(c, http.StatusBadRequest, "Invalid ID")
		return
	}

	entity, err := h.Service.GetByID(uint(id))
	if err != nil {
		h.Responder.NotFound(c, "Entity not found")
		return
	}

	h.Responder.Success(c, http.StatusOK, entity)
}

func (h *Handler[T]) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		h.Responder.Error(c, http.StatusBadRequest, "Invalid ID")
		return
	}

	if _, err := h.Service.GetByID(uint(id)); err != nil {
		h.Responder.NotFound(c, "Entity not found")
		return
	}

	var entity T
	if err := c.ShouldBindJSON(&entity); err != nil {
		h.Responder.Error(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := h.Service.Update(&entity); err != nil {
		h.Responder.Error(c, http.StatusInternalServerError, "Failed to update entity")
		return
	}

	h.Responder.Success(c, http.StatusOK, entity)
}

func (h *Handler[T]) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		h.Responder.Error(c, http.StatusBadRequest, "Invalid ID")
		return
	}

	if err := h.Service.Delete(uint(id)); err != nil {
		h.Responder.Error(c, http.StatusInternalServerError, "Failed to delete entity")
		return
	}

	h.Responder.Success(c, http.StatusOK, gin.H{"message": "Entity deleted successfully"})
}

func (h *Handler[T]) List(c *gin.Context) {
	pageStr := c.DefaultQuery("page", "1")
	pageSizeStr := c.DefaultQuery("pageSize", "10")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		h.Responder.Error(c, http.StatusBadRequest, "Invalid page parameter")
		return
	}

	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize < 1 {
		h.Responder.Error(c, http.StatusBadRequest, "Invalid pageSize parameter")
		return
	}

	offset := (page - 1) * pageSize
	limit := pageSize

	entities, err := h.Service.List(offset, limit)
	if err != nil {
		h.Responder.Error(c, http.StatusInternalServerError, "Failed to list entities")
		return
	}

	h.Responder.Success(c, http.StatusOK, entities)
}
