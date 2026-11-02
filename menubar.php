<nav class="todo-navigation" aria-label="Todo navigation">
    <a
        href="index.php?scope=personal"
        <?= $scope === 'personal' ? 'aria-current="page"' : '' ?>
    >Personal</a>

    <a
        href="index.php?scope=shared"
        <?= $scope === 'shared' ? 'aria-current="page"' : '' ?>
    >Shared</a>
</nav>
