class QueuePlaylistBtnController {
  constructor(modalService) {
    'ngInject';
    this.modalService = modalService;
  }

  addToPlaylist(index) {
    let
    templateUrl = 'app/browse/components/modal/modal-playlist.html',
    controller = 'ModalPlaylistController',
    params = {
      title: 'Add to playlist',
      addQueue: true,
      index: index
    };
    this.modalService.openModal(
      controller,
      templateUrl,
      params,
      'sm');
  }
}

export default QueuePlaylistBtnController;