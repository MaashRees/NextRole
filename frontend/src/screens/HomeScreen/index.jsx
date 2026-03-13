
const HomeScreen = () => {
  useEffect(() => {
    document.title = "Accueil - NextRole";
  }, []);

  return (
    <div>Bienvenue sur l'application</div>
  );
}

export default HomeScreen;