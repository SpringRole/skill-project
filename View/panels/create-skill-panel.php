<div id="create-skill-panel" class="panel-content">

    <?php include("subpanel-top.php") ?>

    <h3><?= _("CREATE SKILL"); ?></h3>
<?php
    if ($skill->getChildrenCount() < $skill->getCapNoMore()) {
?>
    <form method="POST" action="<?= \Controller\Router::url("addSkill"); ?>" id="create-skill-form">
        <input type="hidden" name="selectedSkillUuid" id="selectedSkillUuid" value="<?= $skill->getUuid(); ?>" />
        <input type="hidden" name="skillParentUuid" id="skillParentUuid" value="<?= $skill->getUuid(); ?>" />
        <input type="hidden" name="creationType" id="creationType" value="child" />
        <div>
            <label for="skillName"><?= _("NAME YOUR SKILL") ?></label>
            <input type="text" name="skillName" id="create-skillName" maxlength="45" />
            <p class="hint"><?= _("Hint: "); ?><?= _('Tell yourself "I can" or "I know how to".'); ?><br /><?= _("45 characters max."); ?></p>
        </div>
        <?php if ($parent): //do not show fields for root node (always as child) ?>
        <?php if (in_array("create_as_parent", $rights)){ //do not show either for simple users ?>
        <div>
            <label for="creationType"><?= _("WHERE DOES IT GO"); ?></label>
            <div class="img-btn img-btn-l" id="creationTypeParent" data-value="parent" data-parentuuid="<?= $parent->getUuid(); ?>">
                <img src="img/panel-icon-create-before-noborder.png" alt="<?= _("BEFORE (as a parent)"); ?>" />
                <span class="legend"><?= _("BEFORE (as a parent)"); ?></span>
            </div>
            <div class="img-btn img-btn-r selected" id="creationTypeChild" data-value="child" data-parentuuid="<?= $skill->getUuid(); ?>">
                <img src="img/panel-icon-create-after-noborder.png" alt="<?= _("AFTER (as a child)"); ?>" />
                <span class="legend"><?= _("AFTER (as a child)"); ?></span>
            </div>
        </div>
        <?php } ?>
        <?php endif; ?>
        <div>
            <input type="submit" value="<?= _("CREATE") ?>" />
            <span class="message-zone"></span>
        </div>
    </form>
<?php
} else {
?>
    <h4>
        <?=sprintf(_("You cannot add more skills to \"%s\""), $skill->getName())?>
    </h4>

    <div class="text">
        <p>
            <?=sprintf(_("Current number of sub-skills: <strong>%s</strong>"), $skill->getChildrenCount())?>
        </p>
        <p>
            <?=sprintf(_("Ideally, this skill shouldn't contain more than <strong>%s&nbsp;sub-skills</strong>."), $skill->getCapIdealMax())?>
            <?=_("This soft limit is meant to keep the tree simple and organized.")?>
        </p>
        <p>
            <?=_("In order to reduce the number of skills, you can group them into meaningful groups. However, if you think there are no meaningful ways to group the skills, you can explain it in the \"Discuss\" section and Editors will be able to raise this limit if appropriate.")?>
        </p>
    </div>
<?php
}
?>

    <?php include("panel-bottom.php"); ?>
</div>