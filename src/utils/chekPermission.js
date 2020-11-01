function ErroPermission(error, setIsLoading = null, history) {
  const findStr = error.message.search('401');
  if (findStr !== -1) {
    alert('Você não tem permissão para acessar essa área');
    if (setIsLoading) setIsLoading(false);
    history.push('/');
  }
}

module.exports = ErroPermission;
